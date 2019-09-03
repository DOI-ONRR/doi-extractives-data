import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import TotalDisbursements from '../TotalDisbursements'
import { configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


const mockStore = configureMockStore();
const store = mockStore({});

describe("TotalDisbursements Component", () => {
    it("should render without throwing an error", () => {

        const tree= shallow(
            <Provider store={store}>
              <TotalDisbursements />
            </Provider>
        ).exists()
        expect(toJson(tree)).toMatchSnapshot()
    });
});



