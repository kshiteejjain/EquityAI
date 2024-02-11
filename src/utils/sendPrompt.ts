import { setMessages, isFollowUpPrompt } from '../features/promptListGeneratorSlice/QuestionGeneratorSlice';
export const sendPrompt = (dispatch, props) => {
  dispatch(isFollowUpPrompt(props.isFollowUpPrompt))
  const { messages, generatorPrompt, promptMessage } = props;
  const prompt = [...(messages || []), { role: 'user', content: promptMessage, isVisible: props.isFollowUpPrompt }];
  dispatch(setMessages(prompt));
  try {
    dispatch(generatorPrompt(prompt));
  } catch (error) {
    alert('Error dispatching generatorPrompt:', error);
  }
  return null; // or any other rendering
};
