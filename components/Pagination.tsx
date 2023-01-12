import React from 'react'
import Link from 'next/link';

const Pagination = (props: { totalCount: number, pageslug: string, per_page: number }) => {
    const PER_PAGE = props.per_page;
    const range = (start: number, end: number) =>
        [...Array(end - start + 1)].map((_, i) => start + i)
    return (
        <ul>
            {range(1, Math.ceil(props.totalCount / PER_PAGE)).map((number, index) => (
                <li key={index}>
                    <Link href={`/${props.pageslug}/page/${number}`}>
                        {number}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default Pagination