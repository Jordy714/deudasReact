import { useState } from "react";



function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  const [friends, setFriends] = useState([]);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(show => !show)
    setSelectedFriend(null)
  }
  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelection(friend) {
    //setSelectedFriend(friend)
    setSelectedFriend(cur => cur?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend} />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend} >{!showAddFriend ? "Anadir Amigo" : "Cerrar"}</Button>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {
        friends.map(friend => (
          <Friend
            friend={friend}
            key={friend.id}
            selectedFriend={selectedFriend}
            onSelection={onSelection}
          />
        ))
      }
    </ul>
  )
}

function Friend({ friend, onSelection, selectedFriend }) {

  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>


      {
        friend.balance < 0 ?
          <p className="red">Tu le debes a {friend.name} {Math.abs(friend.balance)}$</p> :
          friend.balance > 0 ?
            <p className="green">{friend.name} te debe {Math.abs(friend.balance)}$</p> :
            <p >Tu y {friend.name} estan pagados</p>}
      <Button onClick={() => onSelection(friend)}>{isSelected ? 'Cerrar' : 'Seleccionar'}</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {

  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("")
    setImage("https://i.pravatar.cc/48")
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫Nombre</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>🔲 Imagen URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)} />
      <Button>Anadir</Button>
    </form>
  )
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("")
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)

  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Abrir cuenta con {selectedFriend.name}</h2>

      <label>Valor de Cuenta 💰</label>
      <input type="text"
        value={bill}
        onChange={e => setBill(Number(e.target.value))} />

      <label>👨‍🎓 Tu gastaste</label>
      <input type="text"
        value={paidByUser}
        onChange={e => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} />

      <label>👫 {selectedFriend.name} gasto </label>
      <input type="text"
        disabled
        value={paidByFriend}
      ></input>

      <label>🤑 Quien pago la cuenta? </label>
      <select
        value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.value)}
      >
        <option value='user'>Tu</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Dividir Cuenta</Button>
    </form>
  )
}
