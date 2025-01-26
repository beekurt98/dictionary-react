import { useEffect, useState, useRef } from 'react'
import './App.css'
import { dictSvg, searchSvg, moonSvg, playSvg, linkOpenSvg } from './Svg.jsx'


const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

function App() {
  const [word, setWord] = useState("")
  const [searched, setSearched] = useState(false)
  const [lightMode, setLightMode] = useState(false)
  const [checked, setChecked] = useState(false)
  const body = document.body
  const formRef = useRef(null)



  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)
    const wordData = await fetch(url + formObj.word).then(r => r.json())
    setWord(wordData[0])
    setSearched(true)
  }

  function changeLight() {
    setChecked(!checked)
    body.classList.add(checked ? "light" : "dark")
    body.classList.remove(checked ? "dark" : "light")
  }

  function changeFont(e) {
    e.preventDefault()
    if (e.target.value == "sansSerif") {
      body.classList.add("sansSerif")
      body.classList.remove("serif", "mono")
    } else if (e.target.value == "serif") {
      body.classList.add("serif")
      body.classList.remove("sansSerif", "mono")
    } else if (e.target.value == "mono") {
      body.classList.add("mono")
      body.classList.remove("serif", "sansSerif")
    }
  }



  return (
    <>
      <div className='header'>
        <div onClick={() => { setSearched(false); formRef.current.reset() }} className="dict-img">{dictSvg}</div>
        <div className="font-select">
          <select onChange={changeFont} name="" id="">
            <option className='sansSerif' value="sansSerif">Sans Serif</option>
            <option className='serif' value="serif">Serif</option>
            <option className='mono' value="mono">Mono</option>
          </select>
        </div>
        <span className='vertical'></span>
        <div className="mode-toggle">
          <label className="switch">
            <input type="checkbox" checked={checked} onChange={changeLight} />
            <span className="slider round"></span>
          </label>
          <div className="moon">{moonSvg}</div>
        </div>
      </div>
      <div className='search-bar' >
        <form ref={formRef} onSubmit={handleSubmit}>
          <input autoComplete='off' type="text" name='word' placeholder='Enter word' />
          <button type="submit" >{searchSvg}</button>
        </form>
      </div>
      {
        searched && word ? <>
          <WordMeaning word={word} setWord={setWord} setSearched={setSearched} />
        </>
          : searched && !word ? <WordNotFound />
            : ""
      }
    </>
  )
}

function WordMeaning({ word, setWord, setSearched }) {
  const [audioOn, setAudio] = useState(false)
  const [noAudio, setNoAudio] = useState(false)

  let audio;

  // if (word.phonetics[1]?.audio) {
  //   audio = new Audio(word.phonetics[1]?.audio)
  // }

  function start() {
    if (!word.phonetics[1]?.audio) {
      setNoAudio(true)
    } else {
      setAudio(true);
      audio.play()
    }
  }

  function pause() {
    audio.pause()
  }

  async function handleClick(word) {
    const wordData = await fetch(url + word).then(r => r.json())
    setWord(wordData[0])
    setSearched(true)
  }

  return (
    <>
      <div className="word-meaning">
        <div className="word-header">
          <h2>{word.word}</h2>
          <p className='ipa'>{word.phonetics[1]?.text}</p>
          <div className='play-btn' onClick={() => start()}> 
            <div className='circle'></div> 
            <div className='triangle'>{playSvg}</div>
          </div>
          {/* {
            noAudio && 
            <div className="no-audio">
              No audio available.
            </div>
          } */}

        </div>
        <div>
          {
            word?.meanings.map((meaning, index) => <div key={index * 98}>
              <div class="word-line">
                <span>{meaning.partOfSpeech}</span>
              </div>

              <div>
                <div className='syn'><p className='h4'>Meaning</p></div>

                <ul>
                  {
                    meaning?.definitions.map((def, index) =>
                      <li key={index * 99}>
                        <p>{def.definition}</p>
                        {
                          meaning.example &&
                          <p className='h4'>{meaning?.example}</p>
                        }
                      </li>
                    )
                  }
                </ul>
                {
                  meaning.synonyms.length != 0 &&
                  <div className='syn'><p className='h4'>Synonyms</p> <a onClick={() => handleClick(meaning.synonyms[0])} className='synoynm'>{meaning.synonyms[0]}</a></div>
                }
              </div>
            </div>
            )
          }
        </div>
        <hr />
        <p className='source'><span>Source</span> <a target="_blank" href={word.sourceUrls}>{word.sourceUrls}</a> {linkOpenSvg}</p>
      </div>
    </>
  )
}

function WordNotFound() {
  return (
    <>
      <div className="not-found">
        <img className='emoji' src='https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/confused-face.png' alt="" />
        {/* <img className='emoji' src='./emoji.png' alt="" /> */}

        <h3>No Definitions Found</h3>
        <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>

      </div>
    </>
  )
}

export default App
