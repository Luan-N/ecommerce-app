export default function DescriptionList({
  items,
  title,
}: {
  items: { label: string; value: string | number }[];
  title: string;
}) {
  return (
    <div id={title} className="my-5 p-4 rounded-2xl shadow-md bg-white scroll-mt-20">
      <h3 className="text-2xl font-semibold mb-4 text-primary">{title}</h3>
      <dl className="divide-y divide-gray-200">
        {items.map((item, index) =>
          !item.value.toString().includes("undefined") && !item.value.toString().includes("N/A") ? (
            <div
              key={index}
              className="grid grid-cols-3 items-center py-3 hover:bg-muted rounded-lg transition-all duration-200"
            >
              <dt className="font-medium text-sm md:text-base min-w-[110px] px-2">{item.label}</dt>
              <dd className="col-span-2 text-sm md:text-base px-2">{item.value}</dd>
            </div>
          ) : null
        )}
      </dl>
    </div>
  );
}
