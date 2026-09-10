"use client";

import { Info, Newspaper, Bell, Calendar } from "lucide-react";
import type { TickerItem } from "@/lib/data/ticker";

interface Props {
  items: TickerItem[];
}

const categoryConfig = {
  News: { icon: Newspaper, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  Notice: { icon: Bell, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  Event: { icon: Calendar, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
} as const;

export default function TickerPreview({ items }: Props) {
  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Tickers are auto-generated
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              The announcement ticker on the homepage automatically displays the latest 3 published items
              from each of <strong>News</strong>, <strong>Notices</strong>, and <strong>Events</strong>.
              No manual management is needed — simply create or update content in those sections and the
              ticker will reflect the changes within minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Current Ticker Items */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Current Ticker Items ({items.length})
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            These items are currently scrolling on the public website
          </p>
        </div>

        <div className="p-4 space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No published content available. Publish some news, notices, or events to see them here.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const config = categoryConfig[item.category];
              const Icon = config.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold uppercase ${config.color}`}>
                        {item.category}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Links to: {item.href}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
