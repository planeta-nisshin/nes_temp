import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import React from 'react'
import Pagination from '../../../../../components/Pagination'
import wpClient from '../../../../../lib/wpapi'

const PER_PAGE = 5
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

const blogcategory = ({ blogs, blogcats, allposts, slugs }: any) => {
  return (
    <div>
      <ul>
        {blogs.map((mem: any) => (
          <li key={mem.id}>
            <Link href={`/blogs/blog/${mem.slug}`}>
              {mem.title.rendered}
            </Link>
            <ul>
              {blogcats.filter((catfi: any) => mem.blogcat.includes(catfi.id)).map((cat: any) => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Pagination totalCount={allposts} pageslug={`blogs/${slugs}`} per_page={PER_PAGE} />
    </div>
  )
}

export const getAllCategoryPagePaths = async () => {
  const resCategory = await wpClient.url(`${API_URL}/wp-json/wp/v2/blogcat?per_page=50`)

  const paths: string[] = await Promise.all(
    resCategory.map((item: any) => {
      const result = wpClient
        .url(`${API_URL}/wp-json/wp/v2/blog?per_page=300&blogcat=${item.id}`)
        .then(() => {
          const range = (start: number, end: number) =>
            [...Array(end - start + 1)].map((_, i) => start + i)

          return range(1, Math.ceil(item.count / PER_PAGE)).map(
            (repo) => `/blogs/${item.slug}/page/${repo}`
          )
        })
      return result
    })
  )

  return paths.flat()
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllCategoryPagePaths()

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const blogcat = await wpClient.url(`${API_URL}/wp-json/wp/v2/blogcat?per_page=100`)
  const category: string = String(context.params?.category)
  const blogcat_slug = await wpClient.url(`${API_URL}/wp-json/wp/v2/blogcat?per_page=100&slug=${category}`)
  const blogcat_id: number = Number(blogcat_slug[0].id)
  const id = Number(context.params?.id)
  const offset = (id - 1) * PER_PAGE
  const blog = await wpClient.url(`${API_URL}/wp-json/wp/v2/blog?offset=${offset}&_embed&per_page=100&blogcat=${blogcat_id}`).perPage(PER_PAGE)
  const allpost = Number(blogcat_slug[0].count)
  return {
    props: {
      blogs: blog,
      blogcats: blogcat,
      allposts: allpost,
      slugs: category,
    }
  }
}

export default blogcategory