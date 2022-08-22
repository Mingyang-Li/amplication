import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Modal,
  Snackbar,
} from "@amplication/design-system";
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import { match } from "react-router-dom";
import { formatError } from "../../util/error";
import "./CreateServiceWizard.scss";
import {
  CreateServiceWizardForm,
  serviceSettings,
} from "./CreateServiceWizardForm";
import * as models from "../../models";
import { createResource, serviceSettingsFieldsInitValues } from "../constants";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import ProgressBar from "../../Components/ProgressBar";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import { AppRouteProps } from "../../routes/routesUtil";
import { AppContext } from "../../context/appContext";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};

const CreateServiceWizard: React.FC<Props> = ({ moduleClass }) => {
  const {
    currentProject,
    setNewResource,
    errorCreateResource,
    loadingCreateResource,
    addEntity,
  } = useContext(AppContext);

  const serviceSettingsFields: MutableRefObject<serviceSettings> = useRef(
    serviceSettingsFieldsInitValues
  );

  const errorMessage = formatError(errorCreateResource);

  const createStarterResource = useCallback(
    (data: models.ResourceCreateWithEntitiesInput, eventName: string) => {
      setNewResource(data, eventName, addEntity);
    },
    [setNewResource, addEntity]
  );

  const handleSubmitResource = (currentServiceSettings: serviceSettings) => {
    serviceSettingsFields.current = currentServiceSettings;
  };

  const handleClick = () => {
    if (!serviceSettingsFields) return;
    const {
      generateAdminUI,
      generateGraphQL,
      generateRestApi,
    } = serviceSettingsFields.current;

    const isResourceWithEntities =
      serviceSettingsFields.current.resourceType === "sample";

    if (currentProject) {
      const resource = createResource(
        currentProject?.id,
        isResourceWithEntities,
        generateAdminUI,
        generateGraphQL,
        generateRestApi
      );

      createStarterResource(
        resource,
        isResourceWithEntities
          ? "createResourceFromSample"
          : "createResourceFromScratch"
      );
    }
  };

  return (
    <Modal open fullScreen css={moduleClass}>
      {loadingCreateResource ? (
        <div className={`${moduleClass}__processing`}>
          <div className={`${moduleClass}__processing__title`}>
            All set! We’re currently generating your service.
          </div>
          <div className={`${moduleClass}__processing__message`}>
            It should only take a few seconds to finish. Don't go away!
          </div>
          <SvgThemeImage image={EnumImages.Generating} />
          <div className={`${moduleClass}__processing__loader`}>
            <ProgressBar />
          </div>
          <div className={`${moduleClass}__processing__tagline`}>
            For a full experience, connect with a GitHub repository and get a
            new Pull Request every time you make changes in your data model.
          </div>
        </div>
      ) : (
        <div className={`${moduleClass}__splitWrapper`}>
          <div className={`${moduleClass}__left`}>
            <div className={`${moduleClass}__description`}>
              <ResourceCircleBadge type={models.EnumResourceType.Service} />
              <h3>Amplication Service Creation Wizard</h3>
              <h2>Let’s start building your service</h2>
              <h3>
                Select which components to include in your service and whether
                to use sample entities
              </h3>
            </div>
          </div>
          <div className={`${moduleClass}__right`}>
            <CreateServiceWizardForm
              handleSubmitResource={handleSubmitResource}
            />
          </div>
        </div>
      )}
      <div className={`${moduleClass}__footer`}>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          disabled
          icon="arrow_left"
          iconPosition={EnumIconPosition.Left}
        >
          {"Back to project"}
        </Button>
        <Button buttonStyle={EnumButtonStyle.Primary} onClick={handleClick}>
          <label>Create Service</label>
        </Button>
      </div>
      <Snackbar open={Boolean(errorCreateResource)} message={errorMessage} />
    </Modal>
  );
};

export default CreateServiceWizard;
