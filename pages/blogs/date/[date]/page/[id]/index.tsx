import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'
import wpClient from '../../../../../../lib/wpapi'
import moment from 'moment'
import Link from 'next/link'
import Pagination from '../../../../../../components/Pagination'
import { formatDate } from '../../../../../../lib/util'
import Membersortitems from '../../../../../../components/Membersortitems'

const PER_PAGE = 5
const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

export const getAllArchivePagePaths = async () => {
  const resArchive = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?per_page=100`)

  const paths: string[] = await Promise.all(
    resArchive.map(async (item: any) => {
      const selectedYearmonth = String(moment(item.date).format('yyyy-MM'))
      const dateall = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?per_page=100&before=${selectedYearmonth}-31T23:59:59&after=${selectedYearmonth}-01T00:00:00`)
      const dateallcount = dateall.length
      const result = wpClient
        .url(`${API_URL}/wp-json/wp/v2/member?per_page=100&before=${selectedYearmonth}-31T23:59:59&after=${selectedYearmonth}-01T00:00:00`)
        .then(() => {
          const range = (start: number, end: number) =>
            [...Array(end - start + 1)].map((_, i) => start + i)
          return range(1, Math.ceil(Number(dateallcount) / PER_PAGE)).map(
            (repo) => `/members/date/${selectedYearmonth}/page/${repo}`
          )
        })
      return result
    })
  )

  return paths.flat()
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllArchivePagePaths()

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const contexts = JSON.parse(JSON.stringify(context))
  const id = Number(context.params?.id)
  const date = String(context.params?.date)
  const offset = (id - 1) * PER_PAGE
  const member = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?offset=${offset}&_embed&per_page=200&before=${date}-31T23:59:59&after=${date}-01T00:00:00`).perPage(PER_PAGE)
  const allpost = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?&per_page=200&before=${date}-31T23:59:59&after=${date}-01T00:00:00`)
  const allcount = Number(allpost.length)
  const memcat = await wpClient.url(`${API_URL}/wp-json/wp/v2/mem_cat?per_page=100`)
  const memall = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?per_page=200`)
  const monthlyIndex = memall.reduce(function (group: any, x: any) {
    const yearMonthString = formatDate(new Date(x["date"]));
    (group[yearMonthString] = group[yearMonthString] || []).push(x);
    return group;
  }, {})
  const memdateall = await wpClient.url(`${API_URL}/wp-json/wp/v2/member?per_page=200&before=${date}-31T23:59:59&after=${date}-01T00:00:00`)
  const memdateallcount = memdateall.length
  return {
    props: {
      members: member,
      memcats: memcat,
      allposts: allcount,
      slugs: contexts,
      dates: date,
      memdateallcounts: memdateallcount,
      monthlyIndexs: monthlyIndex
    }
  }
}

const MemArchive = ({ members, memcats, monthlyIndexs, dates, memdateallcounts }: any) => {
  return (
    <div>
      <Membersortitems monthlyIndexs={monthlyIndexs}/>
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
      <Pagination totalCount={memdateallcounts} pageslug={`members/date/${dates}`} per_page={PER_PAGE} />
    </div>
  )
}

export default MemArchive