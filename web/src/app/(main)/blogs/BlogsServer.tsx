import { getBlogSettings } from "@/lib/data/blog-page-settings";
import { getPublishedBlogs } from "@/lib/data/blogs";
import BlogsClient from "./BlogsClient";

export default async function BlogsServer() {
  const [settings, blogs] = await Promise.all([
    getBlogSettings(),
    getPublishedBlogs(),
  ]);
  return <BlogsClient settings={settings} blogs={blogs} />;
}