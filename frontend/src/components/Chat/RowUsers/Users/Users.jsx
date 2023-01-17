import ScrollToBottom from "react-scroll-to-bottom";
import User from "./User/User";
import './Users.css';

const Users = ({ users }) => {
    return (
        <ScrollToBottom className="users-container">
            {users.map((user, idx) => (
                <div key={`user-${idx}`}>
                    <User user={user} />
                </div>
            ))}
        </ScrollToBottom>
    );
};

export default Users;