const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
import { Client, Databases, Query, ID } from 'appwrite';

const client = new Client().setEndpoint(`https://cloud.appwrite.io/v1`).setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const r = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal('searchTerm',searchTerm)]);

        if (r.documents.length > 0){
            const doc = r.documents[0];
            const updatedDoc = await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        }
        else {
            const doc = await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    }
    catch {
        console.error('Something went wrong while updating search count');
    }
}

export const getTrendingMovies = async () => {
    try {
        const r = await database.listDocuments(DATABASE_ID, COLLECTION_ID, 
            [Query.orderDesc('count'), Query.limit(10)]);
        return r.documents;
    } catch(error){
        console.error('Something went wrong while fetching trending movies from appwrite.js');
    }
}