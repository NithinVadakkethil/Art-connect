
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <StyledView className="mb-2">
      <StyledTouchableOpacity onPress={() => setIsOpen(!isOpen)} className="flex-row justify-between items-center">
        <StyledText className="font-bold">{question}</StyledText>
        <StyledText>{isOpen ? '-' : '+'}</StyledText>
      </StyledTouchableOpacity>
      {isOpen && <StyledText className="text-gray-500 mt-2">{answer}</StyledText>}
    </StyledView>
  );
};

const FAQ = () => {
  const faqs = [
    { question: 'What is the jewellery saving scheme?', answer: 'It is a monthly installment plan where you can invest an amount of your choice. After completing the scheme period, you can redeem the value in gold, diamond, or jewellery purchase.' },
    { question: 'How long is the scheme period?', answer: 'The scheme period is 10 months.' },
    { question: 'Can I choose my monthly installment amount?', answer: 'Yes, you can choose your monthly installment amount.' },
    { question: 'What happens at the end of the scheme?', answer: 'At the end of the scheme, you can redeem the value in gold, diamond, or jewellery purchase.' },
    { question: 'Are the diamonds and gold certified?', answer: 'Yes, all our diamonds and gold are certified.' },
  ];

  return (
    <StyledView className="mb-6">
      <StyledText className="text-lg font-bold mb-4">Frequently asked question</StyledText>
      {faqs.map((faq, index) => (
        <FaqItem key={index} {...faq} />
      ))}
    </StyledView>
  );
};

export default FAQ;
