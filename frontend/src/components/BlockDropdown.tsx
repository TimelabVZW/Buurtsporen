import React, { useState } from 'react';
import { Property, Story } from '../interfaces';
import { Button, MenuItem, Select } from '@mui/material';


type BlockOption = {
  name: string;
  type: string;
  properties: Property[];
};

type BlockManagerProps = {
  story: Story;
  setStory: React.Dispatch<React.SetStateAction<Story | null>>;
};

const blockOptions: BlockOption[] = [
  { name: "Stef", type: "Stef", properties: [{ name: "name", type: "name", value: "Stef" }] },
  { name: "Marieke", type: "Marieke", properties: [{ name: "name", type: "name", value: "Marieke" }] },
  { name: "Evi", type: "Evi", properties: [{ name: "name", type: "name", value: "Evi" }] },
  { name: "Ralph", type: "Ralph", properties: [{ name: "name", type: "name", value: "Ralph" }] },
];

const BlockDropdown: React.FC<BlockManagerProps> = ({ story, setStory }) => {
  const [activeBlock, setActiveBlock] = useState<BlockOption | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedBlock = blockOptions.find(block => block.name === String(event.target.value)) || null;
    setActiveBlock(selectedBlock);
  };

  const handleAddBlock = () => {
    if (activeBlock) {
      const newBlock = {
        type: activeBlock.type,
        position: story.blocks? story.blocks.length + 1 : 1, // assuming position is sequential
        properties: activeBlock.properties.map((prop) => ({
          ...prop,
        })),
      };
      setStory({
        ...story,
        blocks: [...(story.blocks || []), newBlock],
      });

      setActiveBlock(null); // reset active block after adding
    }
  };

  return (
    <div className='block-dropdown'>
        <Select
            className='block-dropdown-select'
            value={activeBlock?.name || ''}
            onChange={(event) => handleSelectChange(event as React.ChangeEvent<{ value: string }>)}
            displayEmpty
            inputProps={{ 'aria-label': 'Select a block' }}
            >
            <MenuItem disabled value="">Select a block</MenuItem>
            {blockOptions.map((block) => (
                <MenuItem key={block.name} value={block.name}>{block.name}</MenuItem>
            ))}
        </Select>
        <Button className='add-button' variant="contained" color="primary" onClick={handleAddBlock} disabled={!activeBlock}>
            Add Block
        </Button>
    </div>
  );
};

export default BlockDropdown;