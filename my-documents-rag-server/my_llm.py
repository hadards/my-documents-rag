# my_llm.py
from langchain_community.llms import Ollama
# from langchain_openai import ChatOpenAI  # Uncomment if using OpenAI

def get_llm():
    return Ollama(model="llama3", temperature=0.7)

    # To use OpenAI instead:
    # return ChatOpenAI(
    #     temperature=0.7,
    #     model="gpt-3.5-turbo",
    #     api_key="your-api-key"
    # )
