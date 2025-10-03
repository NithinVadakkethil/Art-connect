const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getDownloadUrl = functions.https.onCall(async (data, context) => {
  // Check for authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const uid = context.auth.uid;
  const orderId = data.orderId;

  if (!orderId) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an "orderId".');
  }

  try {
    const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found.');
    }

    const orderData = orderDoc.data();

    // Verify the user is the client for this order
    if (orderData.clientId !== uid) {
      throw new functions.https.HttpsError('permission-denied', 'You do not have permission to access this file.');
    }

    // Verify the order is completed and paid
    if (orderData.status !== 'completed' || orderData.paymentStatus !== 'paid') {
      throw new functions.https.HttpsError('failed-precondition', 'The order is not yet completed and paid.');
    }

    // Get the image URL and generate a signed URL
    const imageUrl = orderData.artwork.imageUrl;
    const bucket = admin.storage().bucket();
    // This parsing is fragile and assumes a specific Cloudinary URL structure.
    // A more robust solution would be to store the file path separately.
    const file = bucket.file(imageUrl.split('/').slice(4).join('/'));

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return { downloadUrl: signedUrl };
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw new functions.https.HttpsError('internal', 'An internal error occurred.');
  }
});

exports.onOrderComplete = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Check if the order status has changed to 'completed'
    if (newValue.status === 'completed' && previousValue.status !== 'completed') {
      const artistId = newValue.artistId;

      try {
        // Get the artist's user document
        const artistDoc = await admin.firestore().collection('users').doc(artistId).get();
        if (!artistDoc.exists) {
          console.log(`Artist with ID ${artistId} not found.`);
          return null;
        }

        const artistData = artistDoc.data();
        const referredBy = artistData.referredBy;

        // If the artist was referred by someone, create an achievement for the referrer
        if (referredBy) {
          const achievement = {
            userId: referredBy,
            type: 'referral_first_sale',
            message: `Your referred artist, ${artistData.displayName}, just completed their first sale!`,
            achievedAt: new Date(),
            relatedUserId: artistId,
            orderId: context.params.orderId,
          };

          // Add the new achievement to the referrer's achievements sub-collection
          await admin.firestore()
            .collection('users')
            .doc(referredBy)
            .collection('achievements')
            .add(achievement);

          console.log(`Achievement created for user ${referredBy} for referral sale by ${artistId}.`);
        }
      } catch (error) {
        console.error('Error creating achievement:', error);
      }
    }
    return null;
  });

/**
 * To deploy this function:
 * 1. Make sure you have the Firebase CLI installed: `npm install -g firebase-tools`
 * 2. Log in to Firebase: `firebase login`
 * 3. Initialize Firebase in your project directory (if you haven't already): `firebase init functions`
 *    - Choose JavaScript as the language.
 *    - Do not install dependencies with npm.
 * 4. A `functions` directory will be created. Move this `firestore-cloud-functions.js` file into `functions/index.js`.
 * 5. In the `functions` directory, open `package.json` and add the following dependencies:
 *    "dependencies": {
 *      "firebase-admin": "^11.0.0",
 *      "firebase-functions": "^4.0.0"
 *    }
 * 6. Install the dependencies by running `npm install` inside the `functions` directory.
 * 7. Deploy the function by running `firebase deploy --only functions` from your project root.
 */
