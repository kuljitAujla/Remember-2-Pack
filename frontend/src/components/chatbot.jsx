export default function Chatbot( {packedItems, tripSummary, aiRecommendations} ) {

    const [chatbotHistory, setChatbotHistory] = useState([]);
    
        
    const handleMessageToAI = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chatbot/message-to-ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({packedItems, tripSummary, aiRecommendations, chatbotHistory}),
                credentials: 'include',
            });
            const data = await response.json();
            setChatbotHistory(data.chatbotHistory);
        } catch (error) {
            console.error(error);
    }
}




    return (
        <div className="chatbot-container">
            <div>
                <h1>Chatbot</h1>
            </div>
        </div>
        
    )

}
