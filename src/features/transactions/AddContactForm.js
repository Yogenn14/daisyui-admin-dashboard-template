import { useState } from "react";

function AddContactForm({ countries, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        category: "",
        supplierName: "",
        supplierWebsite: "",
        supplierEmail: "",
        responsive: false,
        remark1: "",
        remark2: "",
        remark3: "",
        place: "",
        country: "",
        contactNo1: "",
        contactNo2: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-box">
            <h3 className="font-bold text-lg">Add Contacts</h3>
            <form onSubmit={handleSubmit} className="py-4">
                <div className="form-control">
                    <label className="label">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Supplier Name</label>
                    <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Supplier Website</label>
                    <input type="text" name="supplierWebsite" value={formData.supplierWebsite} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Supplier Email</label>
                    <input type="email" name="supplierEmail" value={formData.supplierEmail} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span>Responsive</span>
                        <input type="checkbox" name="responsive" checked={formData.responsive} onChange={handleChange} className="checkbox" />
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">Remark 1</label>
                    <input type="text" name="remark1" value={formData.remark1} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Remark 2</label>
                    <input type="text" name="remark2" value={formData.remark2} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Remark 3</label>
                    <input type="text" name="remark3" value={formData.remark3} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Place</label>
                    <input type="text" name="place" value={formData.place} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Country</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="select select-bordered"
                    >
                        <option value="">Select Country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control">
                    <label className="label">Contact No 1</label>
                    <input type="tel" name="contactNo1" value={formData.contactNo1} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">Contact No 2</label>
                    <input type="tel" name="contactNo2" value={formData.contactNo2} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="modal-action">
                    <button type="submit" className="btn">Save</button>
                    <button type="button" className="btn" onClick={onClose}>Close</button>
                </div>
            </form>
        </div>
    );
}

export default AddContactForm;
