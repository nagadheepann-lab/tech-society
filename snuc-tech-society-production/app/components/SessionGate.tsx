'use client'
import {useEffect,useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '../../lib/supabase'
export default function SessionGate({children,role}:{children:React.ReactNode;role?:'student'|'management'}){const router=useRouter();const [ready,setReady]=useState(false);useEffect(()=>{let alive=true;(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace('/login');return}if(role){const {data}=await supabase.from('profiles').select('role').eq('id',user.id).single();const ok=role==='management'?(data?.role==='management'||data?.role==='admin'):data?.role==='student';if(!ok){router.replace('/');return}}if(alive)setReady(true)})().catch(()=>router.replace('/login'));return()=>{alive=false}},[router,role]);return ready?<>{children}</>:<div className="loading-screen"><div className="spinner"/>Loading workspace…</div>}
