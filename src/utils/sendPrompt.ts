import { setMessages } from '../features/APIServices/QuestionGeneratorSlice';
export const sendPrompt = (dispatch: any, props: any) => {
  const { messages, generatorPrompt, promptMessage } = props;
  const prompt = [...(messages || []), { role: 'user', content: promptMessage, }];
  dispatch(setMessages(prompt));
  try {
    dispatch(generatorPrompt(prompt));
  } catch (error) {
    alert(`Error dispatching generatorPrompt:', ${error}`);
  }
  return null; // or any other rendering
};