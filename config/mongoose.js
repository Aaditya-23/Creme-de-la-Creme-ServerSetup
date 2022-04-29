import mongoose from "mongoose";

export default async function Configure_Database() {
  await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("Connected to the database successfully"))
    .catch((error) =>
      console.log(`Error connecting to the database, ${error}`)
    );
}
