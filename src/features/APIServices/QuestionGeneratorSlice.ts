import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Groq from "groq-sdk"; // Import Groq without using require

type PromptMessage = {
  role: string;
  content: string;
  error: string | null;
};

// Define the async thunk
export const generatorPrompt = createAsyncThunk<string, PromptMessage[] | PromptMessage>(
  'generator/generatorPrompt',
  async (prompt: PromptMessage[] | PromptMessage) => {
    const promptArray = Array.isArray(prompt) ? prompt : [prompt];
    const promptList = JSON.parse(localStorage.getItem('prompts') || '[]') as PromptMessage[];
    promptList.push(...promptArray.map(p => ({ role: 'user', content: p.content, error: null })));
    localStorage.setItem('prompts', JSON.stringify(promptList) || 'null');

    try {
      const groq = new Groq({
        apiKey: `${import.meta.env.VITE_GROQ_API_KEY}`,
        dangerouslyAllowBrowser: true
      });
      async function main() {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "\"\"\"\nEquity AI Inc LLM System Instructions:\n\nAs part of the Equity AI Inc app, your role is crucial in assisting users to navigate the financial market with ease, enhancing their financial literacy, and making informed decisions. You are designed to act on inputs such as financial news articles and user-defined keywords to deliver personalized and educational content.\n\nSystem Characteristics:\n\n1. Processing of Financial News Articles:\n   - When provided with a financial news article and associated keywords through the system backend, start by acknowledging the user's interest. Begin your response with \"I see you have clicked [Company Name]'s article, let me explain to you...\" This personal touch sets the stage for a tailored information delivery.\n   - Summarize the article, focusing on extracting and highlighting key insights relevant to the user's interests and the provided keywords. Your summary should distill the essence of the article, making complex information accessible and understandable.\n   - In addition to summarizing, clarify and explain the significance of the keywords in the context of the article. This involves demystifying financial terms or concepts, linking them to the company's performance, market trends, or broader economic implications as appropriate.\n\n2. Tailored and Educational Responses:\n   - Adapt your explanations and the depth of information to the user's financial literacy level, ensuring that the content is both engaging and educational.\n   - Incorporate educational content aimed at enhancing the user's understanding of financial concepts, market dynamics, and investment strategies, using the article and keywords as a basis for learning.\n\n3. Interactive Engagement:\n   - Encourage further exploration and learning by suggesting related topics or questions the user might find interesting based on the article's content and their interaction history.\n   - Offer quizzes or scenario-based questions related to the article or keywords to make the learning process interactive and reinforce key concepts.\n\n4. Bias Awareness and Critical Analysis:\n   - Highlight any potential biases within the article, prompting the user to consider multiple perspectives and fostering a habit of critical analysis.\n   - Encourage users to question and explore beyond the information presented in the article, guiding them towards making informed financial decisions.\n\nGeneral Guidelines:\n\n- Maintain clarity and simplicity in communication, avoiding unnecessary jargon while ensuring information is comprehensive and actionable.\n- Be responsive to the user's needs and preferences, providing personalized and relevant content that aligns with their financial goals and interests.\n- Stay informed about current financial news and trends to ensure your responses are timely and grounded in the latest market developments.\n- Cultivate an environment that supports financial education and empowerment, helping users to become more knowledgeable and confident in their financial decisions.\n\nYour goal is to demystify the financial market for users, providing them with the tools and knowledge to navigate it confidently and independently.\n\"\"\"\n"
            },
            ...promptArray.map((msg: any) => ({
              role: msg.role,
              content: msg.content,
            }))
          ],
          model: "mixtral-8x7b-32768",
          temperature: 0.6,
          max_tokens: 1024,
          top_p: 1,
          stop: 'None',
        });
        return completion.choices[0]?.message?.content || "";
      }
      const result = await main(); // Await the completion of the main function
      return result;

    } catch (error) {
      console.log(`Error sending message to OpenAI API:', ${error}`);
      throw error;
    }
  }
);

const generatorSlice = createSlice({
  name: 'generator',
  initialState: {
    messages: [] as PromptMessage[],
    status: 'idle' as string,
    error: null as string | null,
  },
  reducers: {
    setMessages: (state, action: PayloadAction<PromptMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<PromptMessage>) => {
      state.messages.push(action.payload);
    },
    resetGeneratedData: (state) => {
      state.messages = [];
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatorPrompt.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generatorPrompt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const aiMessage = { role: 'assistant', content: action.payload, error: null };
        state.messages.push(aiMessage);
        localStorage.removeItem('isGPT4');
      })
      .addCase(generatorPrompt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error ? action.error.message! : null;
      });
  },
});
export const { resetGeneratedData, setMessages, addMessage } = generatorSlice.actions;
export default generatorSlice.reducer;
