import { useAuth } from './AuthContext';
import Login from './login';

const Profile = () => {
  const { user, logout } = useAuth();

  // ユーザーがログインしていない場合は、ログインフォームを表示
  if (!user) {
    return <Login onSwitchToRegister={() => {}} />;
  }

  // ログインしている場合は、ユーザー情報を表示
  return (
    <div>
      <h2>ようこそ、{user.email}さん！</h2>
      <p>あなたの役割: {user.role}</p>
      <p>登録日時: {new Date(user.createdAt).toLocaleString()}</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};

export default Profile;
