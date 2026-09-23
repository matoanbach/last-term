export type Book={
    id: string; //Firestore document ID (auto-generated)
    title:string;
    author:string;
    genre:string;
    uid:string; //Firebase Auth user ID- who added this book
}