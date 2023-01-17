import Link from 'next/link'
import React from 'react'

const Membersortitems = (props:any) => {
    return (
        <div>
            <ul>
                {Object.keys(props.monthlyIndexs).map((index) => (
                    <li key={index}>
                        <Link href={`/members/date/${index}/page/1`}>
                            {index.split("-")[0] + "年" + index.split("-")[1] + "月"}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Membersortitems