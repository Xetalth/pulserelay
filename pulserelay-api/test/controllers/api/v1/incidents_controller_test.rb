require "test_helper"

class Api::V1::IncidentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_incidents_index_url
    assert_response :success
  end

  test "should get create" do
    get api_v1_incidents_create_url
    assert_response :success
  end
end
