import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { showNotification } from "../common/headerSlice";

const TopSideButtons = ({ handleAdd }) => {
    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => document.getElementById('add_new_user').showModal()}>Add New</button>
        </div>
    );
};

function Leads() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Select Role",
        linkedIn: "",
        twitter: "",
        facebook: "",
    });
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}user/getAllUsers`);
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8); // Generates a random 8-character password
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const decodedToken = decodeToken(token);
        const assignedBy = decodedToken?.email || "Unknown";
        const password = generateRandomPassword();
        console.log(JSON.stringify({ ...formData, password, assignedBy }))

        try {
            const response = await fetch(`${process.env.REACT_APP_NODE_API_SERVER}user/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, password, assignedBy }),
            });
            const data = await response.json();
            if (response.ok) {
                setUsers((prevUsers) => [...prevUsers, data.user]);
                document.getElementById('add_new_user').close();
                dispatch(showNotification({ message: "New User has been added!", status: 1 }))
            } else {
                console.error("Error:", data.message);
                dispatch(showNotification({ message: "Error adding new user", status: 1 }))

            }
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const getDummyStatus = (index) => {
        if (index % 5 === 0) return <div className="badge">Not Interested</div>;
        else if (index % 5 === 1) return <div className="badge badge-primary">In Progress</div>;
        else if (index % 5 === 2) return <div className="badge badge-secondary">Sold</div>;
        else if (index % 5 === 3) return <div className="badge badge-accent">Need Followup</div>;
        else return <div className="badge badge-ghost">Open</div>;
    };

    const deleteCurrentLead = (index) => {
        dispatch(openModal({
            title: "Confirmation",
            bodyType: MODAL_BODY_TYPES.CONFIRMATION,
            extraObject: { message: `Are you sure you want to delete this lead?`, type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, index }
        }));
    };

    const renderSocialMediaIcons = (user) => (
        <div className="flex space-x-3">
            {user.linkedIn &&
                <a href={user.linkedIn} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
            }
            {user.twitter &&
                <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                    <FaSquareXTwitter />
                </a>
            }
            {user.facebook &&
                <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                </a>
            }
        </div>
    );

    return (
        <>
            <TitleCard title="Current Users" topMargin="mt-2" TopSideButtons={<TopSideButtons handleAdd={handleAdd} />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Id</th>
                                <th>Created At</th>
                                <th>Role</th>
                                <th>Assigned By</th>
                                <th>Social Media</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={`${process.env.REACT_APP_SERVER_BASE_URL}/profileImg/${user.image || 'blank.png'}`} alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm opacity-50">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{moment(user.createdAt).format("DD MMM YY")}</td>
                                    <td><div className="badge badge-outline">{user.role}</div></td>
                                    <td>{user.assignedBy}</td>
                                    <td>{renderSocialMediaIcons(user)}</td>
                                    <td>
                                        <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentLead(index)}>
                                            <TrashIcon className="w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <dialog id="add_new_user" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Add New User</h3>
                            <form>
                                <div className="space-y-4">
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered w-full max-w-xs" />
                                    <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full max-w-xs" />
                                    <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered w-full max-w-xs">
                                        <option disabled value="Select Role">Select Role</option>
                                        <option>Admin</option>
                                        <option>Staff</option>
                                        <option>Intern</option>
                                    </select>
                                    <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="LinkedIn" className="input input-bordered w-full max-w-xs" />
                                    <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter" className="input input-bordered w-full max-w-xs" />
                                    <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Facebook" className="input input-bordered w-full max-w-xs" />
                                </div>
                                <div className="space-x-2 mt-4">
                                    <button onClick={handleAdd} className="btn">Add</button>
                                    <button type="button" className="btn" onClick={() => document.getElementById('add_new_user').close()}>Close</button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>
            </TitleCard>
        </>
    );
}

export default Leads;
