import React, { ChangeEvent, ChangeEventHandler, useState } from "react"
import '../../css/darkmodeSlider.css'


const toggleDarkMode = ()=>{
    if (localStorage.getItem('theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
        localStorage.setItem('theme', 'light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
        localStorage.setItem('theme', 'dark')
    }
}

export const DarkModeToggle = ()=>{
    const [checked, setChecked] = useState<boolean>((localStorage.getItem('theme') == 'dark'));
    const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
        setChecked(e.currentTarget.checked);
        toggleDarkMode();
    }
    return <>
        <label className="switch">
          <input 
          type="checkbox" 
          onChange={onChange} 
          checked={checked}/>
          <span className="slider">
            <svg className="slider-icon" viewBox="0 0 24 24" fill="none" height="20" stroke="#000" strokeLinecap="round"
              strokeLinejoin="round" strokeWidth="2" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </span>
        </label>
    </>
    
}