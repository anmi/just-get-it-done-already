import { useStore } from "../storage/StoreContext"
import styles from './GlobalControls.module.css'

export const GlobalControls = () => {
  const store = useStore()

  return <div class={styles.cont}>
    <div class={styles.controls}>
      <button
        onClick={e => {
          const fileName = 'tasks.json'
          const content = localStorage.getItem('tasks')
          if (!content) return

          var a = document.createElement("a");
          var file = new Blob([content], { type: 'application/json' });
          a.href = URL.createObjectURL(file);
          a.download = fileName;
          a.click();
        }}
      >Save...</button>
      <button onClick={e => {
        const filepick = document.createElement('input')
        filepick.setAttribute('type', 'file')
        filepick.click()
        filepick.addEventListener('change', e => {
          const files = filepick.files
          if (!files) return
          const file = files[0]
          if (!file) return
            
          const reader = new FileReader()

          reader.onload = function (e) {
            if (!e.target) return
            
            const content = e.target.result
            
            store.updateFromJSON(content as string)
          }
          
          reader.readAsText(file)
        })
      }}>Load...</button>
    </div>
  </div>
}