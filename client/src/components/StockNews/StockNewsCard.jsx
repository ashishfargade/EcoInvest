import React from "react";

export const StockNewsCard = ({ article }) => {
  if (!article) return null;

  const { title, description, content, url, image, publishedAt, source } =
    article;

  return (
    <div className="w-full bg-gradient-to-br from-slate-100 to-white border border-slate-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full md:w-52 h-36 object-cover rounded-lg shadow-sm"
          />
        )}
        <div className="flex flex-col justify-between w-full">
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {title}
              </a>
            </h3>
            <p className="text-sm text-gray-700 mb-2">{description}</p>
            {content && (
              <p className="text-sm text-gray-600 line-clamp-4">{content}</p>
            )}
          </div>
          <div className="text-xs text-gray-500 flex justify-between mt-4">
            <span>📅 {new Date(publishedAt).toLocaleDateString()}</span>
            <span>📰 {source?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
