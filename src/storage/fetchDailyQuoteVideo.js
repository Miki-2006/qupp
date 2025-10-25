
import { collection, getDocs } from "firebase/firestore";
import db from "./firebaseConfig";

const fetchDailyQuoteVideo = async () => {
    try {
        const videoUrlCol = collection(db, 'dailyQuoteVideo')
        const videoUrlSnapshot = await getDocs(videoUrlCol)
        const videoUrl = videoUrlSnapshot.docs.map(doc => doc.data())
        return videoUrl[0];
    } catch (error) {
        console.log("Error in fetching daily quote video:", error);
    }
}

export default fetchDailyQuoteVideo;