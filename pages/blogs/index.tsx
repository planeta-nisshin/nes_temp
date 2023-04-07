import { GetStaticProps } from 'next'
import Link from 'next/link'
import React from 'react'
import Pagination from '../../components/Pagination'
import wpClient from '../../lib/wpapi'

const PER_PAGE = 5
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

const blogs = ({ blogs, memcats, allposts }: any) => {
    return (
        <>
            <ul>
                {blogs.map((mem: any) => (
                    <li key={mem.id}>
                        <Link href={`/blogs/blog/${mem.slug}`}>
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
            <Pagination totalCount={allposts} pageslug={`blogs`} per_page={PER_PAGE} />
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const blog = await wpClient.url(`${API_URL}/wp-json/wp/v2/blog?_embed&per_page=100`).perPage(PER_PAGE)
    const allpost = await wpClient.url(`${API_URL}/wp-json/wp/v2/blog?per_page=100`)
    const allcount = Number(allpost.length)
    const memcat = await wpClient.url(`${API_URL}/wp-json/wp/v2/blog_cat?per_page=100`)
    return {
        props: {
            blogs: blog,
            memcats: memcat,
            allposts: allcount
        }
    }
}

export default blogs