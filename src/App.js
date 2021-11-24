import logo from "./logo.svg";
import "./App.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { CButton, CNav, CNavItem, CNavLink, CTabContent, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CTabPane } from "@coreui/react";
import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [activeKey, setActiveKey] = useState(1);
  const contractAddress = "0x01f4b2b8655B81403E877F8D5B938B0235954e44";
  const ABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
      ],
      name: "PaymentSent",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "merchant",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
      ],
      name: "PlanCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "subscriber",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
      ],
      name: "SubscriptionCancelled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "subscriber",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
      ],
      name: "SubscriptionCreated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
      ],
      name: "cancel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "frequency",
          type: "uint256",
        },
      ],
      name: "createPlan",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "nextPlanId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "subscriber",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
      ],
      name: "pay",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "plans",
      outputs: [
        {
          internalType: "address",
          name: "merchant",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "frequency",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "planId",
          type: "uint256",
        },
      ],
      name: "subscribe",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "subscriptions",
      outputs: [
        {
          internalType: "address",
          name: "subscriber",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "nextPayment",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
  const [provider, setProvider] = useState(new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/"));
  const [lastPlan, setLastPlan] = useState(0)


  return (
    <>
      
      <CButton color="info">Connect</CButton>
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            Plans
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            Subcribe
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 3}
            onClick={() => setActiveKey(3)}
          >
            Contact
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane
          role="tabpanel"
          aria-labelledby="home-tab"
          visible={activeKey === 1}
        >
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell scope="row">1</CTableHeaderCell>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>@mdo</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">2</CTableHeaderCell>
                <CTableDataCell>Jacob</CTableDataCell>
                <CTableDataCell>Thornton</CTableDataCell>
                <CTableDataCell>@fat</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="row">3</CTableHeaderCell>
                <CTableDataCell colSpan="2">Larry the Bird</CTableDataCell>
                <CTableDataCell>@twitter</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CTabPane>
        <CTabPane
          role="tabpanel"
          aria-labelledby="profile-tab"
          visible={activeKey === 2}
        >
          2
        </CTabPane>
        <CTabPane
          role="tabpanel"
          aria-labelledby="contact-tab"
          visible={activeKey === 3}
        >
          3
        </CTabPane>
      </CTabContent>
    </>
  );
}

export default App;
