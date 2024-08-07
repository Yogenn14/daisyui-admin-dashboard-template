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

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
        dispatch(openModal({title: "Add New Lead", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW}));
    };

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewLeadModal}>Add New</button>
        </div>
    );
};

function Leads() {
    const [users, setUsers] = useState([]);
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
            <TitleCard title="Current Users" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
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
                                                    <img src={user.image || "default-avatar.png"} alt="Avatar" />
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
                </div>
            </TitleCard>
        </>
    );
}

export default Leads;
