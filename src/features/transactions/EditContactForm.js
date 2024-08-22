import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

const EditContactForm = ({ contact, countries, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({ ...contact });
    const dispatch = useDispatch();

    useEffect(() => {
        setFormData({ ...contact });
    }, [contact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
        } catch (error) {
            dispatch(showNotification({ message: "Error updating contact", status: 0 }));
        }
    };

    return (
        <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Contacts</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
                <label className="label">Category</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                />
            </div>
            <div className="form-control">
                <label className="label">Supplier Name</label>
                <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                />
            </div>
            <div className="form-control">
                <label className="label">Supplier Website</label>
                <input
                    type="url"
                    name="supplierWebsite"
                    value={formData.supplierWebsite}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
            <div className="form-control">
                <label className="label">Supplier Email</label>
                <input
                    type="email"
                    name="supplierEmail"
                    value={formData.supplierEmail}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                />
            </div>
            <div className="form-control">
                <label className="label">Country</label>
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="select select-bordered"
                    required
                >
                    {countries.map((country, index) => (
                        <option key={index} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-control">
                <label className="label">Contact No 1</label>
                <input
                    type="text"
                    name="contactNo1"
                    value={formData.contactNo1}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
            <div className="form-control">
                <label className="label">Contact No 2</label>
                <input
                    type="text"
                    name="contactNo2"
                    value={formData.contactNo2}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
            <div className="form-control">
                <label className="label">Remark 1</label>
                <input
                    type="text"
                    name="remark1"
                    value={formData.remark1}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
            <div className="form-control">
                <label className="label">Remark 2</label>
                <input
                    type="text"
                    name="remark2"
                    value={formData.remark2}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
            <div className="form-control">
                <label className="label">Remark 3</label>
                <input
                    type="text"
                    name="remark3"
                    value={formData.remark3}
                    onChange={handleChange}
                    className="input input-bordered"
                />
            </div>
            <div className="modal-action">
                <button type="submit" className="btn">
                    Update
                </button>
                <button type="button" onClick={onClose} className="btn">
                    Cancel
                </button>
            </div>
        </form>
        </div>
    );
};

export default EditContactForm;
