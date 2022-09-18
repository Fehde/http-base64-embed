import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const file = useRef<string>()
  const embed = useRef<HTMLEmbedElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const open = useRef<HTMLAnchorElement>(null)
  const download = useRef<HTMLAnchorElement>(null)

  useEffect(()=>{
    fetch('/api/pdf').then(res=>res.json()).then(json=>{
      // バイナリを Embed する方法
      if(embed.current){
        embed.current.type = 'application/pdf'
        embed.current.src=`data:application/pdf;base64,${json.data}#toolbar=0&navpanes=0`
      }

      // Blob URL に変換して参照させる方法
      fetch(`data:application/pdf;base64,${json.data}`).then(res=>res.blob()).then(blob=>{
        const name = json.name
        file.current = URL.createObjectURL(blob)  // 一時 URL を作成

        if(iframe.current){
          iframe.current.src = `${file.current}#toolbar=0&navpanes=0`
        }
        if(open.current){
          open.current.href = file.current
        }
        if(download.current){
          download.current.href = file.current
          download.current.download = name  // ダウンロード指示 & ファイル名をサジェスト
        }
      })
    })

    // cleanup
    return ()=>{
      if(file.current) {
        URL.revokeObjectURL(file.current)  // URL を解放 (メモリリークも防止)
      }
    }
  },[])

  return (
    <main className={styles.main}>
      <div><embed ref={embed} width={800} height={800}/></div>
      <div><iframe ref={iframe} width={800} height={800}/></div>
      <div><a ref={open}>開く</a></div>
      <div><a ref={download}>ダウンロード</a></div>
    </main>
  )
}

export default Home
