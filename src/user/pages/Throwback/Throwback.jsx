import React from 'react'
import CardGrid from './Cards'

const Throwback = () => {
  const resdata = [
    {
      src:'https://picsum.photos/seed/51/300/200',
      title:'New 1',
      likes: 2,
      desc:''
    },
     {
      src:'https://picsum.photos/seed/53/300/200',
      title:'New 2',
      likes: 10,
      desc:''
    },
     {
      src:'https://picsum.photos/seed/60/300/200',
      title:'New 3',
      likes: 7,
      desc:''
    },
     {
      src:'https://picsum.photos/seed/57/300/200',
      title:'New 4',
      likes: 1,
      desc:''
    },
     {
      src:'https://picsum.photos/seed/50/300/200',
      title:'New 5',
      likes: 20,
      desc:''
    },
     {
      src:'https://picsum.photos/seed/59/300/200',
      title:'New 6',
      likes: 11,
      desc:''
    },
  ]

  return (
    <div>
      <div className="w-full p-2 flex max-sm:flex-col justify-between items-center dark:text-white">
        <h1 className="font-bold text-lg">
            Throwback Pictures
        </h1>

        <input type="search" placeholder='Type description here..'
        className='p-2 text-xs rounded-xl border-2 min-w-[250px] border-gray-200 font-semibold dark:bg-gray-700 dark:border-gray-600 duration-200 ' />
      </div>

      <CardGrid datas={resdata}/>
    </div>
  )
}

export default Throwback
