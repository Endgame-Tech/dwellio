# CategorizedImageUpload Component

A reusable React component for uploading images organized by categories (Living Room, Kitchen, Bedroom, etc.) with minimum image requirements per category.

## Features

- ✅ **Tab-based category selection** - Switch between different room types
- ✅ **Minimum image validation** - Enforces minimum 3 photos per category
- ✅ **Visual feedback** - Color-coded badges show completion status
- ✅ **Upload summary** - Overview of all categories and total images
- ✅ **Drag & hover effects** - Smooth UX with remove buttons on hover
- ✅ **Responsive design** - Works on mobile, tablet, and desktop

## Usage

### Basic Example

```tsx
import { useState } from "react";
import CategorizedImageUpload, {
  CategorizedImage,
} from "../components/CategorizedImageUpload";

function MyComponent() {
  const [images, setImages] = useState<CategorizedImage[]>([]);

  return <CategorizedImageUpload images={images} onChange={setImages} />;
}
```

### With Custom Categories

```tsx
import { useState } from "react";
import CategorizedImageUpload, {
  CategorizedImage,
  ImageCategory,
} from "../components/CategorizedImageUpload";

function MyComponent() {
  const [images, setImages] = useState<CategorizedImage[]>([]);

  const customCategories: ImageCategory[] = [
    { id: "front", label: "Front View", minImages: 2 },
    { id: "back", label: "Back View", minImages: 2 },
    { id: "interior", label: "Interior", minImages: 5 },
    { id: "amenities", label: "Amenities", minImages: 3 },
  ];

  return (
    <CategorizedImageUpload
      images={images}
      onChange={setImages}
      categories={customCategories}
    />
  );
}
```

### In a Form

```tsx
import { useState } from "react";
import CategorizedImageUpload, {
  CategorizedImage,
} from "../components/CategorizedImageUpload";

interface FormData {
  title: string;
  description: string;
  media: CategorizedImage[];
}

function PropertyForm() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    media: [],
  });

  const handleImagesChange = (newImages: CategorizedImage[]) => {
    setFormData((prev) => ({
      ...prev,
      media: newImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum images per category
    const categories = ["living_room", "kitchen", "bedroom"];
    for (const cat of categories) {
      const count = formData.media.filter((img) => img.category === cat).length;
      if (count < 3) {
        alert(`Please add at least 3 images for ${cat}`);
        return;
      }
    }

    // Submit formData...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}

      <CategorizedImageUpload
        images={formData.media}
        onChange={handleImagesChange}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Props

| Prop         | Type                                   | Default            | Description                     |
| ------------ | -------------------------------------- | ------------------ | ------------------------------- |
| `images`     | `CategorizedImage[]`                   | **Required**       | Array of images with categories |
| `onChange`   | `(images: CategorizedImage[]) => void` | **Required**       | Callback when images change     |
| `categories` | `ImageCategory[]`                      | Default categories | Custom category definitions     |
| `className`  | `string`                               | `''`               | Additional CSS classes          |

## Types

### CategorizedImage

```typescript
interface CategorizedImage {
  url: string; // Image URL
  category: string; // Category ID (e.g., 'living_room')
  filename?: string; // Optional filename
}
```

### ImageCategory

```typescript
interface ImageCategory {
  id: string; // Unique category ID
  label: string; // Display name
  minImages?: number; // Minimum required images
  maxImages?: number; // Maximum allowed images (future)
}
```

## Default Categories

The component comes with sensible defaults:

- **Living Room** - min. 3 images
- **Kitchen** - min. 3 images
- **Bedroom** - min. 3 images
- **Bathroom** - min. 3 images
- **Outside/Exterior** - min. 3 images
- **Aerial View** - min. 1 image
- **Other** - no minimum

## Validation Helper

```typescript
// Check if all categories meet minimum requirements
function validateImages(
  images: CategorizedImage[],
  categories: ImageCategory[]
): boolean {
  for (const category of categories) {
    if (category.minImages) {
      const count = images.filter((img) => img.category === category.id).length;
      if (count < category.minImages) {
        return false;
      }
    }
  }
  return true;
}
```

## Styling

The component uses Tailwind CSS and adapts to your theme:

- **Landlord Panel**: Blue accent colors (`landlord-*` classes)
- **Client Panel**: ubani-yellow accent colors (dark theme)

Both versions are available:

- `/landlord/src/components/CategorizedImageUpload.tsx` - Landlord version
- `/client/src/components/CategorizedImageUpload.tsx` - Client version (dark theme)

## Backend Integration

When sending to the backend, you may want to transform the data:

```typescript
// Group images by category for easier backend processing
function groupImagesByCategory(images: CategorizedImage[]) {
  return images.reduce((acc, img) => {
    if (!acc[img.category]) {
      acc[img.category] = [];
    }
    acc[img.category].push(img.url);
    return acc;
  }, {} as Record<string, string[]>);
}

// Example output:
// {
//   living_room: ['url1', 'url2', 'url3'],
//   kitchen: ['url4', 'url5', 'url6'],
//   ...
// }
```

## Notes

- Image URLs are validated on blur
- Invalid images show a placeholder
- Minimum requirements are visually indicated with colored badges
- All categories show in the summary at the bottom
- The active category's images are displayed in the grid
