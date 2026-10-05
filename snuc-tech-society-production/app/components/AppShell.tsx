'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'
import {usePathname,useRouter} from 'next/navigation'
import {LayoutDashboard,Compass,ClipboardList,Trophy,ShieldCheck,LogOut,Menu,X,UserRound,PlusCircle} from 'lucide-react'
import {supabase} from '../../lib/supabase'
import NotificationBell from './NotificationBell'

export default function AppShell({children}:{children:React.ReactNode}){
 const path=usePathname();const router=useRouter();const [profile,setProfile]=useState<any>(null);const [open,setOpen]=useState(false)
 useEffect(()=>{supabase.auth.getUser().then(async({data:{user}})=>{if(user){const {data}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();setProfile(data)}})},[path])
 const management=profile?.role==='management'||profile?.role==='admin'
 const links=[['Home','/',LayoutDashboard],['Opportunities','/opportunities',Compass],['My Applications','/applications',ClipboardList],['My Wins','/wins',Trophy],...(management?[['Management','/management',ShieldCheck]]:[]) ] as any[]
 async function signOut(){await supabase.auth.signOut();router.push('/login')}
 return <div className="shell"><aside className={open?'mobile-open':''}><div className="brand"><div className="brand-mark">S</div><div><b>SNUC</b><span>TECH SOCIETY</span></div><button className="mobile-close" onClick={()=>setOpen(false)}><X/></button></div><nav>{links.map(([n,h,I])=><Link key={n} href={h} onClick={()=>setOpen(false)} className={path===h||path.startsWith(h+'/')?'active':''}><I size={18}/><span>{n}</span></Link>)}</nav><div className="side-bottom">{profile&&<div className="profile-mini"><div className="avatar">{(profile.full_name||'U').split(' ').map((x:string)=>x[0]).slice(0,2).join('')}</div><div><b>{profile.full_name||'Student'}</b><span>{management?'Management':'Student'}</span></div></div>}<button onClick={signOut} className="signout"><LogOut size={16}/> Sign out</button><div className="tiny">SNU Chennai · Build. Apply. Achieve.</div></div></aside><main><header className="mobile-header"><button onClick={()=>setOpen(true)}><Menu/></button><b>SNUC Tech Society</b>{profile?<NotificationBell/>:null}</header>{profile&&<div className="global-tools"><NotificationBell/><div className="user-pill"><UserRound size={15}/>{profile.full_name||'Account'}</div></div>}{children}</main></div>
}
