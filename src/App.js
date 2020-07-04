import React, { useEffect } from 'react';

const App = () => {
  const [users, setUsers] = React.useState([
    {
      name: "satou",
      age: 11,
      email: "satou@gmail.com"
    },
    {
      name: "abe",
      age: 40,
      email: "hiroshi@mail.jp"
    }
  ])

  const handleGet = () => {
    // サーバと通信できれば良いので、サーバにリクエストを送る。
    fetch("/api/users")
    // 非同期処理の関数.then()なら、非同期処理が成功した場合の処理を書く
    // res(任意)は、サーバから送られるレスポンスが入る。レスポンスの形式のままでは処理できないのでjsonに変換する。
    .then(res=>res.json())
    // json形式に変換したレスポンスをコンソールに表示する。
    .then(res=>{
      console.log(res)
      setUsers(res.data)
    })
    .catch(err=>{
      console.error(err)
    })
  }


  // 以下でレンダリング直後に自動的にデータベースと通信し、データをクライアント側に反映してくれます。
  React.useEffect(()=>{
    handleGet()
  }, [])








  const handleDelete = (id) => {
    
    // 上記を確かめるために、handleDelete内でidが使用できるか確認。
    // console.log(id)
    
    // サーバにidさえ送ればok
    fetch("/api/users", {
      method: "DELETE",
      headers : {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        // 以下でidをサーバ側へ渡す。
        id: id,
      })
    }).then(res=>res.json())
    .then(res=>{
      console.log(res.msg)
      setUsers(res.data)
    })
    .catch(err=>console.error(err))
  }


  return (
    <>
      <form onSubmit={(e)=>{
        e.preventDefault()
        fetch("/api/users", {
          method: "POST",
          headers : {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            name: e.target.name.value,
            age: e.target.age.value,
            email: e.target.email.value,
          })
        }).then(res=>res.json())
        .then(res=>{
          console.log(res.msg)
          setUsers(res.data)
        }).catch(err=>console.error(err))
      }}>
        <input type="text" name="name"/>
        <input type="number" name="age" />
        <input type="email" name="email"/>
        <button type="submit">送信</button>
      </form>
      { users.map((value, index)=>(
        <>
          <p>ユーザ{index + 1}</p>
          <p>名前 : {value.name}</p>
          <p>年齢 : {value.age}</p>
          <button onClick={()=>{
            const newUsers = users.slice()
            newUsers[index].age++
            setUsers(newUsers)
          }}>+</button>
          <button onClick={()=>{
            const newUsers = users.slice()
            newUsers[index].age--
            setUsers(newUsers)
          }}>-</button>
          <p>メール : {value.email}</p>
          <button onClick={()=>{
            handleDelete(value._id)
          }}>このデータを削除する</button>
          <hr></hr>
        </>
      )) }
      {/* <button onClick={handleGet}>GET</button> */}
    </>
  )
}

export default App;
