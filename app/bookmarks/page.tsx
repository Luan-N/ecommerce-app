import BookmarkClient from "./bookmarks-client";

export default function Bookmark() {
  return (
    <main className="my-25 p-2">
      <section className="flex flex-col items-start bg-white rounded-lg shadow-md p-5">
        <h1 className="font-semibold text-lg text-orange-800 uppercase border-b pb-2 mb-4 w-full">
          BOOKMARKS
        </h1>

        <BookmarkClient />
      </section>
    </main>
  );
}
