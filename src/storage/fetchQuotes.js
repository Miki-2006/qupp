import { collection, getDocs } from "firebase/firestore/lite";
import db from "./firebaseConfig";

const fetchQuotes = async () => {
    try {
        const quotesCol = collection(db, 'quotes')
        const quotesSnapshot = await getDocs(quotesCol)
        const quotes = quotesSnapshot.docs.map(doc => doc.data())
        return quotes;
    } catch (error) {
        console.log("Error in fetching quotes:", error);
    }
}

export default fetchQuotes;