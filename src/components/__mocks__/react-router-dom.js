// __mocks__/react-router-dom.js
import React from "react";

const mockLink = jest.fn().mockReturnValue(<div>Mock Link</div>);

export const Link = mockLink;
