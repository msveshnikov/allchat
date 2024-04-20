import React from "react";

const mockLink = jest.fn().mockReturnValue(<div>Mock Link</div>);
export const Link = mockLink;

const mockParams = {};
export const useParams = jest.fn(() => mockParams);

const mockNavigate = {};
export const useNavigate = jest.fn(() => mockNavigate);
