import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import wpClient from '../lib/wpapi'
import styles from '../styles/Home.module.css'

const Home: NextPage = ({ posts, blogs, memcats }: any) => {
  return (
    <div className={styles.container}>
      <Head>
        <title></title>
        <meta name="description" content="" />
      </Head>
      <main className={styles.main}>
        スターター
        {/* <ul>
          {posts.map((post: any) => (
            <li key={post.id}>
              <Link href={post.slug}>
                {post.slug}
              </Link>
            </li>
          ))}
        </ul>
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
        </ul> */}
      </main>
    </div>
  )
}

// export const getStaticProps: GetStaticProps = async () => {
//   const data = await wpClient.posts().perPage(10)
//   const blog = await wpClient.url(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/blog`).perPage(3)
//   const memcat = await wpClient.url(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/mem_cat`)
//   return {
//     props: {
//       posts: data,
//       blogs: blog,
//       memcats: memcat
//     }
//   }
// }

export default Home
