import * as React from 'react';
import * as Cards from '../cards/cards';
import { NewDeckDialog } from './NewDeckDialog';
import { shallow } from 'enzyme';
import update from 'immutability-helper';

function ignore(deck: Cards.Deck) {}

describe("the submit button", () => {
  it("doesn't allow submission with an empty name", () => {
    const wrapper = shallow(<NewDeckDialog onNewDeck={ignore} />);
    wrapper.instance().setState(state => update(state, { form: { name: { $set: "" } } }));
    expect(wrapper.find('button').prop('disabled')).toBeTruthy();
  });
  it("allows submission with a nonempty name", () => {
    const wrapper = shallow(<NewDeckDialog onNewDeck={ignore} />);
    wrapper.instance().setState(state => update(state, { form: { name: { $set: "nonempty" } } }));
    expect(wrapper.find('button').prop('disabled')).toBeFalsy();
  });
});
