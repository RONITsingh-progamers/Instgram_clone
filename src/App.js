import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';         
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in successfully.
        console.log(authUser);
        setUser(authUser);
      }
      else {
        setUser(null);
        // User logged out successfully.
      }
    })

    return () => {
      // perform some clean effect 
      unsubscribe();
    }

  }, [user, username]);
  useEffect(() => {
    db.collection('post').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({ displayName: username })
      })
      .catch((error) => { alert(error.message) });
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password).catch((error) => { alert(error.message) });

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form action="" className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input placeholder="Enter your username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Enter your email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form action="" className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            </center>
            <Input placeholder="Enter your email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            < Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            < Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="app__posts">
        {posts.map(({ id, post }) => (<Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />))}
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>You need to be logged in</h3>
      )}
    </div >
  );
}

export default App;
