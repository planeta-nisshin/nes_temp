import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import React from 'react'
import Pagination from '../../../../../components/Pagination'
import wpClient from '../../../../../lib/wpapi'

const PER_PAGE = 5
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

const MemCategory = ({ members, memcats, allposts, slugs }: any) => {
  return (
    <div>
      <ul>
        {members.map((mem: any) => (
          <li key={mem.id}>
            <Link href={`/members/member/${mem.slug}`}>
              {mem.title.rendered}
            </Link>
            <ul>
              {memcats.filter((catfi: any) => mem.mem_cat.includes(catfi.id)).map((cat: any) => (
                <li key={cat.id}>{cat.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Pagination totalCount={allposts} pageslug={`members/${slugs}`} per_page={PER_PAGE} />
    </div>
  )
}

export const getAllCategoryPagePaths = async () => {
  const resCategory = await wpClient.url(`${API_URL}/wp-json/wp/v2/mem_cat?per_page=100`)

  const paths: string[] = await Promise.all(
    resCategory.map((item: any) => {
      const result = wpClient
        .url(`${API_URL}/wp-json/wp/v2/member?per_page=100&mem_cat=${item.id}`)
        .then(() => {
          const range = (start: number, end: number) =>
            [...Array(end - start + 1)].map((_, i) => start + i)

          return range(1, Math.ceil(item.count / PER_PAGE)).map(
            (repo) => `/members/${item.slug}/page/${repo}`
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
  const memcat = await wpClient.url(`${API_URL}/wp-json/wp/v2/mem_cat?per_page=100`)
  const category: string = String(context.params?.category)
  const memcat_slug = await wpClient.url(`${API_URL}/wp-json/wp/v2/mem_cat?per_page=100&slug=${category}`)
  const memcat_id: number = Number(memcat_slug[0].id)
  const id = Number(context.params?.id)
  const offset = (id - 1) * PER_PAGE
  const member = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?offset=${offset}&_embed&per_page=100&mem_cat=${memcat_id}`).perPage(PER_PAGE)
  const allpost = Number(memcat_slug[0].count)
  return {
    props: {
      members: member,
      memcats: memcat,
      allposts: allpost,
      slugs: category,
    }
  }
}

export default MemCategory