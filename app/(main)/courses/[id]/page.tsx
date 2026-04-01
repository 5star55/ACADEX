import React from 'react'
import { api } from '@/convex/_generated/api';
import {fetchQuery} from 'convex/nextjs'
import MaterialCard from '@/components/card';

export default async function page({params}:{params:Promise<{id:string}>}) {
    const {id}= await params;
    const listmaterials= await fetchQuery(api.materials.listMaterialsByCourse, {courseCode: id})
  return (
    <div>
      <ul className='grid grid-cols-2 gap-8 mx-10'>
        {listmaterials.map((mat)=>(
            <li key={mat._id}><MaterialCard material={mat}/></li>
        ))}
      </ul>
    </div>
  )
}
