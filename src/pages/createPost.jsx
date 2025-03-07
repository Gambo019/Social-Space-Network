import { toast } from 'react-toastify'
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// importing Navbar
import Navbar from '../components/Navbar'

// Emoji Picker
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


// Login Page Template
const CreatePost = () => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [showEmojis, setShowEmojis] = useState(false)
    const [postText, setPostText] = useState('')
    

    // Post References
    const user_id = user.id
 
    const addEmoji = (e) => {
        const sym = e.unified.split("_")
        const codeArray = []
        sym.forEach((el) => codeArray.push("0x" + el))
        let emoji = String.fromCodePoint(...codeArray)
        setPostText(postText + emoji)
    }

    const getUserMetaData = async (current_user_id) => {
        const { data, error } = await supabase.from('users_data').select()

        if(error){
            console.log(error);
        }

        if(data){
            for(var i=0; i<data.length; i++){
                if(data[i].user_id === current_user_id){
                    return data[i]
                }
                else{
                    console.log('Nothing found...');
                }
            }
        }

        return () => {}
    }


    const insertNewPost = async () => {

        const user_meta_data = await getUserMetaData(user.id)

        console.log(user_meta_data);

        const { error } = await supabase.from('posts').insert({
            author: user_meta_data.username,
            content: postText,
            user_id: user_id
        })

        if(error){
            console.log(error);
        }

        if(!error){
            console.log("Post created!");
            navigate('/home')
        }

        return () => {}
    }

    if(!user){
        return null
    }

    return (
        <>
            <Navbar />
            <div className='newPostPage'>
                <div className='newPostPage-header'>
                    <h1 style={{marginBottom: '30px'}}>Create a new Purple Post!</h1>
                    <div className='newPostPage-body'>
                        <textarea value={postText} onChange={(e) => {setPostText(e.target.value)}} name="contentPost" id="contentPost" cols="30" rows="10"></textarea>
                        <div className="extra-btns">
                            <button onClick={() => {setShowEmojis(!showEmojis)}} className="emojis"><i class="fa-solid fa-face-smile"></i></button>
                            <button className='emojis'><i class="fa-solid fa-images"></i></button>
                            <button className='emojis'><i class="fa-solid fa-video"></i></button>
                        </div>
                        {showEmojis && <div className="emojiPicker">
                            <Picker data={data} emojiSize={18} emojiButtonSize={28} onEmojiSelect={addEmoji} />
                        </div>}
                        <button className='postBtn' style={{fontStyle: 'italic'}} onClick={(e) => {
                            e.preventDefault();
                            insertNewPost()
                        } }><i class="fa-solid fa-paper-plane"></i> Post Purple</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost;