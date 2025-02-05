// "use client";
// import { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// export default function Page() {
//   const [petals, setPetals] = useState([]);
//   const [newPetal, setNewPetal] = useState({
//     title: '',
//     subtitle: '',
//     slug: '',
//     hero_img: '',
//     description: '',
//     images: [],
//   });
//   const [editPetal, setEditPetal] = useState(null);
//   const [token, setToken] = useState(''); // Store your JWT token here

//   // Fetch petals from the API
//   useEffect(() => {
//     async function fetchPetals() {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       setPetals(data);
//     }

//     fetchPetals();
//   }, [token]);

//   // Add a new petal
//   const handleAddPetal = async () => {
//     const formData = new FormData();
//     formData.append('title', newPetal.title);
//     formData.append('subtitle', newPetal.subtitle);
//     formData.append('slug', newPetal.slug);
//     formData.append('description', newPetal.description);
//     formData.append('hero_img', newPetal.hero_img); // Assuming hero_img is a file
//     newPetal.images.forEach((image) => {
//       formData.append('images', image); // Append each image file
//     });

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (res.ok) {
//       setNewPetal({
//         title: '',
//         subtitle: '',
//         slug: '',
//         hero_img: '',
//         description: '',
//         images: [],
//       });
//       const addedPetal = await res.json();
//       setPetals([...petals, addedPetal]);
//     } else {
//       console.error('Failed to add petal');
//     }
//   };

//   // Update a petal
//   const handleUpdatePetal = async () => {
//     const formData = new FormData();
//     formData.append('title', editPetal.title);
//     formData.append('subtitle', editPetal.subtitle);
//     formData.append('slug', editPetal.slug);
//     formData.append('description', editPetal.description);
//     formData.append('hero_img', editPetal.hero_img); // Assuming hero_img is a file
//     editPetal.images.forEach((image) => {
//       formData.append('images', image); // Append each image file
//     });

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Petals/${editPetal.id}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (res.ok) {
//       const updatedPetal = await res.json();
//       setPetals(petals.map((petal) => (petal.id === editPetal.id ? updatedPetal : petal)));
//       setEditPetal(null);
//     } else {
//       console.error('Failed to update petal');
//     }
//   };

//   // Handle file uploads
//   const handleHeroImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewPetal({ ...newPetal, hero_img: file });
//     }
//   };

//   const handleImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setNewPetal({ ...newPetal, images: files });
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-8">Manage Petals</h1>

//       {/* Add Petal Form */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-2xl font-semibold mb-4">Add New Petal</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//             placeholder="Title"
//             value={newPetal.title}
//             onChange={(e) => setNewPetal({ ...newPetal, title: e.target.value })}
//           />
//           <input
//             type="text"
//             className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//             placeholder="Subtitle"
//             value={newPetal.subtitle}
//             onChange={(e) => setNewPetal({ ...newPetal, subtitle: e.target.value })}
//           />
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//             placeholder="Slug"
//             value={newPetal.slug}
//             onChange={(e) => setNewPetal({ ...newPetal, slug: e.target.value })}
//           />
//           <input
//             type="file"
//             className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//             onChange={handleHeroImageChange}
//           />
//         </div>
//         <div className="mb-4">
//           <ReactQuill
//             value={newPetal.description}
//             onChange={(value) => setNewPetal({ ...newPetal, description: value })}
//             placeholder="Description"
//           />
//         </div>
//         <div className="mb-4">
//           <input
//             type="file"
//             multiple
//             className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//             onChange={handleImagesChange}
//           />
//         </div>
//         <button
//           onClick={handleAddPetal}
//           className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//         >
//           Add Petal
//         </button>
//       </div>

//       {/* Update Petal Form */}
//       {editPetal && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <h2 className="text-2xl font-semibold mb-4">Update Petal</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//               placeholder="Title"
//               value={editPetal.title}
//               onChange={(e) => setEditPetal({ ...editPetal, title: e.target.value })}
//             />
//             <input
//               type="text"
//               className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//               placeholder="Subtitle"
//               value={editPetal.subtitle}
//               onChange={(e) => setEditPetal({ ...editPetal, subtitle: e.target.value })}
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//               placeholder="Slug"
//               value={editPetal.slug}
//               onChange={(e) => setEditPetal({ ...editPetal, slug: e.target.value })}
//             />
//             <input
//               type="file"
//               className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//               onChange={handleHeroImageChange}
//             />
//           </div>
//           <div className="mb-4">
//             <ReactQuill
//               value={editPetal.description}
//               onChange={(value) => setEditPetal({ ...editPetal, description: value })}
//               placeholder="Description"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               type="file"
//               multiple
//               className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
//               onChange={handleImagesChange}
//             />
//           </div>
//           <button
//             onClick={handleUpdatePetal}
//             className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//           >
//             Update Petal
//           </button>
//         </div>
//       )}

//       {/* Displaying Petals */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Petals List</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {petals.map((petal) => (
//             <div key={petal.id} className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-xl font-semibold">{petal.title}</h3>
//               <p className="text-sm text-gray-500 mb-4">{petal.subtitle}</p>
//               <div className="flex justify-between">
//                 <button
//                   onClick={() => setEditPetal(petal)}
//                   className="py-1 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDeletePetal(petal.id)}
//                   className="py-1 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



const page = () => {



  


  return (
    <div>
      Enter
    </div>
  );
}

export default page;