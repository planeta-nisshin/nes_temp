import Link from 'next/link'
import React from 'react'
import wpClient from '../../../lib/wpapi'

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

const Blog = ({ post }: any) => {
    return (
        <div>
            <div>{post.title.rendered}</div>
            <div>{post.acf.blog_title1}</div>
            <div>
                {
                    post.next ?
                        <Link href={`/blogs/blog/${post.next.slug}`}>
                            次の人ー<br />
                            {post.next.title}
                        </Link>
                        : ""
                }
            </div>
            <div>
                {
                    post.prev ?
                        <Link href={`/blogs/blog/${post.prev.slug}`}>
                            前の人ー<br />
                            {post.prev.title}
                        </Link>
                        : ""
                }
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    const posts = await wpClient.url(`${API_URL}/wp-json/wp/v2/blog?per_page=100`)
    return {
        paths: posts.map((post: any) => ({
            params: {
                slug: post.slug
            }
        })),
        fallback: false
    }
}

export const getStaticProps = async ({ params }: any) => {
    const posts = await wpClient.url(`${API_URL}/wp-json/wp/v2/blog?per_page=100&_embed`).slug(params.slug as string)
    return {
        props: {
            post: posts[0]
        }
    }
}

export default Blog