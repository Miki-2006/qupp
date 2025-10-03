import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import db from "./firebaseConfig";

const fetchDailyQuote = async () => {
    try {
        const dailyQuoteCol = collection(db, 'dailyQuote')
        const dailyQuotesSnapshot = await getDocs(dailyQuoteCol)
        const [quoteId] = dailyQuotesSnapshot.docs.map(doc => doc.data())

        const quotesDocRef = doc(db, 'quotes', quoteId.quote_id)
        const quotesDocSnap = await getDoc(quotesDocRef)
        return quotesDocSnap.data();        
    } catch (error) {
        console.log("Error in fetching daily quote:", error);
    }
}

export default fetchDailyQuote;